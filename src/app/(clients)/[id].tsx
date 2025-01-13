import React, { useEffect, useState } from 'react';
import {
  Button,
  Center,
  ClientForm,
  ClientNotes,
  Column,
  Container,
  CustomModal,
  KeyboardContainer,
  Row,
  SaveCancelButtons,
  Text,
} from '@/components/commons';
import { ActivityIndicator, Image, Keyboard, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormik } from 'formik';
import { useClientStore } from '@/zustand/client/client.store';
import { ClientPayload } from '@/utils/routes/routes.clients.service';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '@/utils';
import { useUserStore } from '@/zustand/user/user.store';
import { useNoteStore } from '@/zustand/notes/notes.store';

import { router, useNavigation } from 'expo-router';
import { ArrowLeft, Cart, Edit } from '../../../assets/svg';
import { validationClientSchema } from '@/utils/validations/clients/clients.validations';
import { AxiosError } from 'axios';
import { SalesRoutesLink } from '@/utils/routes/sales.routes';
import { Header } from '@/components/headers';
import { OrdersRoutesLink } from '@/utils/routes/orders.routes';
import ModalSplash from '@/components/splash/modal.splash';
import { staticImages } from '../../../assets/images';

export default function Client() {
  const { params } = useRoute<RouteProp<{ params: { itemId: string } }>>();
  const { createClient, updateClient, getClients, getClientById, loading: storeLoading, client, clearClient } = useClientStore();
  const { createNote, notes: notesFromStore } = useNoteStore();
  const user = useUserStore((state) => state.user);
  const platform = Platform.OS;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<{ title: string; description: string; date: Date }[]>([]);
  const [isEditable, setIsEditable] = useState(!params?.itemId);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [showSuccessView, setShowSuccessView] = useState(false);
  const navigation = useNavigation();
  const [clientName, setClientName] = useState(client?.name ?? 'Nuevo cliente');

  const addNote = (newNote: { title: string; description: string; date: Date }) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };
  const removeNote = (noteTitle: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.title !== noteTitle));
  };

  const updateModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      managerName: '',
      rut: '',
      nextVisit: '',
      status: 'POTENTIAL',
      email: '',
      ci: '',
      department: '',
      isOneTime: false,
      neighborhood: '',
      latitude: '',
      longitude: '',
      note: [],
      user: [
        {
          id: '',
        },
      ],
      competenceName: '',
      additionalContact: '',
    },
    validationSchema: validationClientSchema,
    validateOnChange: true,
    onSubmit: async (payload: ClientPayload) => {
      const payloadValues = { ...payload, note: notes };
      Keyboard.dismiss();

      try {
        if (params?.itemId) {
          await updateClient(params.itemId, {
            ...payload,
            user: [
              {
                id: user?.id,
              },
            ],
          });

          const existingNotesTitles = notesFromStore.map((note) => note.title);
          const newNotes = notes.filter((note) => !existingNotesTitles.includes(note.title));

          for (const note of newNotes) {
            await createNote({
              ...note,
              client: {
                id: params.itemId,
              },
            });
          }

          updateModal('¡Cliente Actualizado Exitosamente!', 'El cliente se ha actualizado correctamente.');
          return;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const clientError: any = await createClient({
            ...payloadValues,
            user: [{ id: user?.id }],
          });

          if (clientError.length > 0) {
            updateModal(
              'Error al crear el cliente',
              clientError?.includes('duplicate')
                ? 'Este nombre ya está en uso. Intenta con otro.'
                : 'Ocurrió un error al crear el cliente. Por favor, intenta de nuevo más tarde.',
            );
            return;
          }

          setShowSuccessView(true);
        }

        await getClients();
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          console.log(`Error: ${error.response.data.message}, Status Code: ${error.response.status}`);
        } else if (error instanceof Error) {
          console.error('Ocurrió un error inesperado:', error.message);
        } else {
          console.error('Ocurrió un error desconocido:', error);
        }
      }
    },
  });

  useEffect(() => {
    const fetchClientData = async () => {
      if (params?.itemId) {
        try {
          setLoading(true);
          await getClientById(params.itemId);
        } catch (error) {
          console.error('Error fetching client data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        formik.resetForm();
        setLoading(false);
      }
    };

    fetchClientData();
  }, [params]);

  useEffect(() => {
    if (client) {
      formik.setValues(client);
    }
  }, [client]);

  useEffect(() => {
    return () => {
      formik.resetForm();
      clearClient();
    };
  }, []);

  useEffect(() => {
    if (client?.name) {
      setClientName(client.name);
    }
  }, [client?.name]);

  useEffect(() => {
    navigation.setOptions({
      header: () =>
        !showSuccessView && (
          <Header
            title={clientName}
            showArrow
            rightIcon={
              params.itemId &&
              !isEditable && (
                <TouchableOpacity
                  onPress={() => {
                    setIsEditable(true);
                  }}
                >
                  <Edit color="black" />
                </TouchableOpacity>
              )
            }
            background={Colors.white}
            onBackPress={() => router.back()}
          />
        ),
    });
  }, [navigation, clientName, params.itemId, isEditable, showSuccessView]);

  if (loading) {
    return (
      <Center>
        <ActivityIndicator color={Colors.black} />
      </Center>
    );
  }

  const handleCancel = () => {
    if (isEditable && formik.dirty) {
      updateModal('Cambios sin guardar', `Los cambios realizados no se guardarán.\n ¿Desea continuar?`);
    } else {
      return router.back();
    }

    if (!isEditable) {
      return router.back();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (modalTitle.includes('Error')) {
      setShowModal(false);
      return;
    }

    if (modalTitle.includes('Cambios sin guardar')) {
      setShowModal(false);
      return;
    }

    if (modalTitle.includes('Exitosamente')) {
      router.back();
    }
  };

  const handleConfirmModal = () => {
    router.back();
  };
  return (
    <>
      <KeyboardContainer extraScrollHeight={32} keyboardShouldPersistTaps="handled">
        <Container paddingHorizontal={12} paddingVertical={platform === 'ios' ? 12 : 24} gap={24} style={styles.container}>
          <ClientForm formik={formik} isEditable={isEditable} clientId={params?.itemId} />
          {params.itemId && !isEditable ? (
            <ClientNotes notes={notes} addNote={addNote} removeNote={removeNote} clientId={params?.itemId} />
          ) : (
            <ClientNotes notes={notes} addNote={addNote} removeNote={removeNote} isEditable={isEditable} />
          )}
          {params.itemId && !isEditable && (
            <Row justifyContent="space-between">
              <Button
                onPress={() =>
                  router.push({
                    pathname: OrdersRoutesLink.ORDERS_BUDGET_ID,
                    params: {
                      clientID: params.itemId,
                    },
                  })
                }
                type="outlined"
                borderColor={Colors.SKY_BLUE}
                style={{ text: { color: Colors.SKY_BLUE } }}
              >
                Generar presupuesto
              </Button>
              <Button
                onPress={() =>
                  router.push({
                    pathname: SalesRoutesLink.SALES,
                    params: {
                      clientID: params.itemId,
                    },
                  })
                }
                leftIcon={<Cart width={16} color={Colors.white} />}
              >
                Generar venta
              </Button>
            </Row>
          )}
        </Container>
        {isEditable && <SaveCancelButtons onCancel={handleCancel} onSave={formik.handleSubmit} loading={storeLoading} />}
        {!modalTitle.includes('Error') && (
          <CustomModal
            isVisible={showModal}
            title={modalTitle}
            onConfirm={handleConfirmModal}
            onClose={handleCloseModal}
            content={<Text textColor={Colors.black}>{modalMessage}</Text>}
          />
        )}
        {modalTitle.includes('Error') && (
          <CustomModal
            isVisible={showModal}
            title={modalTitle}
            onClose={handleCloseModal}
            content={<Text textColor={Colors.black}>{modalMessage}</Text>}
          />
        )}
      </KeyboardContainer>
      {showSuccessView && (
        <ModalSplash
          content={
            <Column gap={32} justifyContent="center" alignItems="center">
              <Text fontSize={24} textColor={Colors.white} fontWeight={700} transform="uppercase">
                Cliente Nuevo
              </Text>
              <Image source={staticImages.GENERATE_CLIENT} />
              <Text fontSize={14} fontWeight={700} textColor={Colors.white} textAlign="center">
                El cliente nuevo se guardó exitosamente. {'\n'} ¿Qué desea hacer a continuación?
              </Text>

              <Row gap={8}>
                <Button
                  onPress={() =>
                    router.replace({
                      pathname: OrdersRoutesLink.ORDERS_BUDGET_ID,
                      params: {
                        clientID: params.itemId,
                      },
                    })
                  }
                  textColor={Colors.white}
                  type="outlined"
                  borderColor={Colors.white}
                >
                  Generar presupuesto
                </Button>
                <Button
                  onPress={() =>
                    router.replace({
                      pathname: SalesRoutesLink.SALES,
                      params: {
                        clientID: params.itemId,
                      },
                    })
                  }
                  backgroundColor={Colors.white}
                  textColor={Colors.RED}
                >
                  Generar Venta
                </Button>
              </Row>
              <Button
                type="text"
                leftIcon={<ArrowLeft width={16} color={Colors.white} />}
                onPress={() => router.back()}
                textColor={Colors.white}
              >
                Volver
              </Button>
            </Column>
          }
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
});
